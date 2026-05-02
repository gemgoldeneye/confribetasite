import { defineConfig } from "chromatic";

export default defineConfig({
  // CHROMATIC_PROJECT_TOKEN must be set as a GitHub Actions secret.
  // Get it at https://www.chromatic.com after creating the project.
  onlyChanged: true,
  autoAcceptChanges: "main",
});
