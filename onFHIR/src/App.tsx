import { FetchFhirClient, FhirClient } from "@bonfhir/core/r4b";
import { MantineRenderer } from "@bonfhir/mantine/r4b";
import { FhirQueryProvider } from "@bonfhir/query/r4b";
import { FhirUIProvider } from "@bonfhir/react/r4b";
import {
  Alert,
  AppShell,
  Center,
  Loader,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "react-oidc-context";
import { Outlet, useNavigate } from "react-router-dom";

/**
 * Customize Mantine Theme.
 * https://mantine.dev/theming/theme-object/
 */
const theme = createTheme({});

export default function App() {
  const navigate = useNavigate();

  return (
    <MantineProvider theme={theme}>
      <AuthProvider
        authority="http://localhost:8103"
        client_id="f54370de-eaf3-4d81-a17e-24860f667912"
        redirect_uri={document.location.origin}
      >
        <WithAuth>
          <FhirUIProvider
            renderer={MantineRenderer}
            onNavigate={({ target, aux }) => {
              if (aux) {
                window.open(target, "_blank");
              } else {
                navigate(target);
              }
            }}
          >
            <AppShell>
              <AppShell.Main>
                <Outlet />
              </AppShell.Main>
            </AppShell>
          </FhirUIProvider>
        </WithAuth>
      </AuthProvider>
    </MantineProvider>
  );
}

function WithAuth({ children }: PropsWithChildren) {
  const auth = useAuth();
  const [fhirClient, setFhirClient] = useState<FhirClient | undefined>();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token && !fhirClient) {
      setFhirClient(
        new FetchFhirClient({
          baseUrl: "http://localhost:8103/fhir/R4/",
          auth: `Bearer ${auth.user?.access_token}`,
          onError(response) {
            if (response.status === 401) {
              auth.signoutRedirect();
            }
          },
        }),
      );
      // Clear the URL for any OpenID params
      history.pushState(null, "", location.href.split("?")[0]);
      return;
    }

    if (auth.isAuthenticated || auth.isLoading) return;

    auth.signinRedirect();
  }, [auth, fhirClient]);

  if (auth.isLoading) {
    return (
      <AppShell>
        <AppShell.Main>
          <Center h="100vh">
            <Loader />
          </Center>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (auth.error) {
    return (
      <AppShell>
        <AppShell.Main>
          <Center h="100vh">
            <Alert variant="filled" color="red" title="Oops...">
              {auth.error.message}
            </Alert>
          </Center>
        </AppShell.Main>
      </AppShell>
    );
  }

  if (fhirClient) {
    return (
      <FhirQueryProvider fhirClient={fhirClient}>
        {children}
        <ReactQueryDevtools />
      </FhirQueryProvider>
    );
  }

  return null;
}
