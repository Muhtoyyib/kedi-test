import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ChipGroup} from "@/components/ui/chip-group";
import {Drawer} from "@/components/ui/drawer";
import {useToast} from "@/components/ui/toast";

export function ChipDemo() {
  const [value, setValue] = useState("all");
  return (
    <ChipGroup
      aria-label="Product category"
      value={value}
      onChange={setValue}
      options={[
        {value: "all", label: "All"},
        {value: "digestive", label: "Digestive health"},
        {value: "immunity", label: "Immunity"},
        {value: "mens", label: "Men's health"},
      ]}
    />
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open cart drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Your order">
        <p>Cart contents live here.</p>
      </Drawer>
    </>
  );
}

export function ToastDemo() {
  const {show} = useToast();
  return (
    <Button variant="secondary" onClick={() => show({message: "Added to cart", action: {label: "View", onClick: () => {}}})}>
      Show toast
    </Button>
  );
}
