import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AdminAuthProvider } from "./context/AdminAuthContext";

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AdminAuthProvider>
  );
}