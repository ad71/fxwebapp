"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
  Field,
  Input,
  Select,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Modal,
  ModalBody,
  ModalFooter,
  Drawer,
  DrawerBody,
  DrawerFooter,
  ToastProvider,
  useToast,
  Skeleton,
  Tooltip,
} from "../../components/ui";
import styles from "./page.module.css";

function ToastDemo() {
  const { addToast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        addToast({
          title: "Saved",
          message: "Your changes were saved.",
          variant: "success",
        })
      }
    >
      Show Toast
    </Button>
  );
}

export default function ComponentsPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <ToastProvider>
      <main className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroTitle}>UI Component Kit</div>
          <div className={styles.heroMeta}>
            Custom primitives aligned to the FX platform design language. Calm surfaces,
            consistent spacing, and minimal visual noise.
          </div>
          <div className={styles.heroActions}>
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="ghost">Ghost Action</Button>
          </div>
        </div>

        <div className={styles.showcaseGrid}>
          <div className={styles.showcaseCard}>
            <div className={styles.showcaseTitle}>Buttons</div>
            <div className={styles.showcaseMeta}>Clear action hierarchy.</div>
            <div className={styles.row}>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button loading>Loading</Button>
            </div>
          </div>
          <div className={styles.showcaseCard}>
            <div className={styles.showcaseTitle}>Badges</div>
            <div className={styles.showcaseMeta}>Compact status indicators.</div>
            <div className={styles.row}>
              <Badge>Neutral</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>Cards</div>
          <div className={styles.muted}>Elevated surfaces for data-heavy views.</div>
          <Card style={{ marginTop: "var(--space-16)" }}>
            <CardHeader>
              <CardTitle>FX Rates</CardTitle>
            </CardHeader>
            <CardBody>
              Keep a calm, consistent layout for complex data screens.
            </CardBody>
          </Card>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>Form Inputs</div>
          <div className={styles.muted}>Clean fields with calm focus states.</div>
          <div className={styles.row} style={{ marginTop: "var(--space-16)" }}>
            <Field label="Currency Pair" helperText="Example: USD/INR">
              <Input placeholder="USD/INR" />
            </Field>
            <Field label="Tenor">
              <Select>
                <option>1M</option>
                <option>3M</option>
                <option>6M</option>
              </Select>
            </Field>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>Table</div>
          <div className={styles.muted}>Compact typography and subtle separators.</div>
          <div className={styles.tableWrap} style={{ marginTop: "var(--space-16)" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Pair</TableHeaderCell>
                  <TableHeaderCell>Bid</TableHeaderCell>
                  <TableHeaderCell>Ask</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>USD/INR</TableCell>
                  <TableCell>82.30</TableCell>
                  <TableCell>82.34</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>Tabs</div>
          <div className={styles.muted}>Segmented controls with soft elevation.</div>
          <div style={{ marginTop: "var(--space-16)" }}>
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTrigger value="one">Overview</TabsTrigger>
                <TabsTrigger value="two">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="one">Overview content.</TabsContent>
              <TabsContent value="two">Detailed content.</TabsContent>
            </Tabs>
          </div>
        </div>

        <div className={styles.sectionGrid}>
          <Card>
            <CardHeader>
              <CardTitle>Modal & Drawer</CardTitle>
            </CardHeader>
            <CardBody className={styles.row}>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                Open Drawer
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toast, Tooltip, Skeleton</CardTitle>
            </CardHeader>
            <CardBody className={styles.row}>
              <ToastDemo />
              <Tooltip content="Pricing source: FRED">
                <Button variant="ghost">Hover me</Button>
              </Tooltip>
              <Skeleton style={{ width: 180, height: 36 }} />
            </CardBody>
          </Card>
        </div>
      </main>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Confirm action">
        <ModalBody>Are you sure you want to proceed?</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </Modal>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Details">
        <DrawerBody>Drawer content with extra info.</DrawerBody>
        <DrawerFooter>
          <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
            Close
          </Button>
        </DrawerFooter>
      </Drawer>
    </ToastProvider>
  );
}
