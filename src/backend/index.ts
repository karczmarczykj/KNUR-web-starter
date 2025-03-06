import { __DEVELOPMENT__, __PRODUCTION__, __TEST__, __COMPONENT_SERVER__, __COMPONENT_AUTH_SERVER__ } from "./defined-globals";

if (__DEVELOPMENT__) {
  console.log("Development mode");
} else if (__PRODUCTION__) {
  console.log("Production mode");
} else if (__TEST__) {
  console.log("Test mode");
}

if (__COMPONENT_SERVER__) {
  console.log("Server component");
}

if (__COMPONENT_AUTH_SERVER__) {
  console.log("Auth server component");
}

