"""
Minimal FMP FX poller (EURUSD 1-min bars)

Install:
  pip install requests

Run:
  export FMP_API_KEY="YOUR_KEY"
  python fmp_fx_poller.py --symbol EURUSD --interval 15
"""

symbols = [
    # Major Currency Pairs
    "EURUSD", "USDJPY", "GBPUSD", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD",
    
    # INR as Quote Currency
    "AEDINR", "AUDINR", "CADINR", "CHFINR", "CNHINR", "CNYINR", "DKKINR", 
    "EURINR", "GBPINR", "HKDINR", "IDRINR", "INRINR", "JPYINR", "KRWINR", 
    "MYRINR", "NOKINR", "NZDINR", "PKRINR", "SEKINR", "SGDINR", "THBINR", 
    "TWDINR", "USDINR", "XAGINR", "XAUINR", "ZARINR"
]


import argparse
import os
import time
import requests
from datetime import datetime, timedelta
import pytz

BASE_URL = "https://financialmodelingprep.com/stable/historical-chart/1min"  # [web:20]
LIST_URL = "https://financialmodelingprep.com/stable/forex-list"

from dotenv import load_dotenv
load_dotenv()


import os
import requests

def print_fmp_forex_symbols(api_key: str | None = None) -> list[str]:
    """
    Fetches FMP's supported FX pairs from /stable/forex-list and prints them.
    Returns the symbol list.
    """
    api_key = api_key or os.getenv("FMP_API_KEY")
    if not api_key:
        raise ValueError("Missing API key (pass api_key=... or set FMP_API_KEY).")

    url = "https://financialmodelingprep.com/stable/forex-list"  # [web:30]
    r = requests.get(url, params={"apikey": api_key}, timeout=30)  # apikey via query param [web:4]
    r.raise_for_status()
    rows = r.json()

    # Response is a list of objects; the pair symbol is typically in the 'symbol' field. [web:30]
    symbols = sorted({row.get("symbol") for row in rows if isinstance(row, dict) and row.get("symbol")})
    print(symbols)
    return symbols


def fetch_list(api_key: str):
    r = requests.get(
        LIST_URL,
        params={"apikey": api_key},
        timeout=15
    )
    r.raise_for_status()
    data = r.json()

    if isinstance(data, list) and data:
        return data[0]
    return None


def fetch_latest_bar(symbol: str, api_key: str) -> dict | None:
    r = requests.get(
        BASE_URL,
        params={"symbol": symbol, "apikey": api_key},  # apikey passed as query param [web:24]
        timeout=15,
    )
    r.raise_for_status()
    data = r.json()

    # FMP returns an array of bars (most recent first for this endpoint in practice).
    # We'll just take the first element if present.
    if isinstance(data, list) and data:
        return data[0]
    return None


def convert_utc_to_ist(utc_dt_str: str) -> str:
    """
    Convert UTC datetime string to IST datetime string.
    Assumes input like '2023-04-26 13:45:00' (FMP's format).
    Returns ISO string in IST.
    """
    # FMP format is usually 'YYYY-MM-DD HH:MM:SS'
    utc = pytz.utc
    try:
        dt_utc = datetime.strptime(utc_dt_str, "%Y-%m-%d %H:%M:%S")
        dt_utc = utc.localize(dt_utc)
        ist = pytz.timezone('Asia/Kolkata')
        dt_ist = dt_utc.astimezone(ist)
        return dt_ist.strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        # fallback: return as is
        return utc_dt_str


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--symbol", default="EURUSD")
    p.add_argument("--interval", type=int, default=15, help="Seconds between polls.")
    args = p.parse_args()

    api_key = os.getenv("FMP_API_KEY")
    if not api_key:
        raise SystemExit("Missing FMP_API_KEY env var")

    last_seen_dt = None
    try:
        bar = print_fmp_forex_symbols(api_key)
        print(bar)
    except Exception as e:
        print(f"error: {e}")

    while True:
        try:
            bar = fetch_latest_bar(args.symbol, api_key)
            if bar:
                # Common field in this API is 'date' (string timestamp) for each bar. [web:20]
                dt = bar.get("date")
                if dt and dt != last_seen_dt:
                    last_seen_dt = dt
                    dt_ist = convert_utc_to_ist(dt) if dt else None
                    bar_with_ist = dict(bar)  # Copy to avoid mutating the original
                    if dt_ist:
                        bar_with_ist["date_IST"] = dt_ist
                    print(bar_with_ist)  # Print bar including IST datetime
        except Exception as e:
            print(f"error: {e}")

        time.sleep(args.interval)


if __name__ == "__main__":
    main()
