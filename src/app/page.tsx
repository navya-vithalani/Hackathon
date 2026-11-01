import LandingPage from "./LandingPage";
import { ViewTransition } from "react";

export default function Home() {
  return (
    <ViewTransition
      enter={{ 'hive-enter': 'hive-arrive', default: 'none' }}
      exit={{ 'hive-enter': 'hive-depart', default: 'none' }}
      default="none"
    >
      <LandingPage />
    </ViewTransition>
  );
}
