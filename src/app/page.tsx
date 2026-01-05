import { redirect } from "next/navigation";
import { appRoutes } from "@/features/routes";

export default function RootPage() {
  redirect(appRoutes.home.path);
}
