import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "../contexts/AuthContext";

export default function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
      </AuthProvider>
    </AdminAuthProvider>
  );
}
