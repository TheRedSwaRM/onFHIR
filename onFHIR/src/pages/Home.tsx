import { useFhirRead } from "@bonfhir/query/r4b";
import { FhirQueryLoader, FhirValue } from "@bonfhir/react/r4b";
import { Group, Paper, Stack, Text } from "@mantine/core";
import PatientReportsTable from "../components/PatientReportsTable";

export default function Home() {
  const patientQuery = useFhirRead(
    "Patient",
    "6bc3dd32-a3a8-4bb8-8158-c83fc2780fd2",
  );
  
  return (
    <Paper p="xl"> {/*Mantine Component, to learn more, read Mantine documentation*/}
      <Paper shadow="sm" p="xl">
        <FhirQueryLoader query={patientQuery}>
          {(patient) => (
            <Stack gap="xs">
              <Text size="xl">
                <FhirValue type="HumanName" value={patient.name} />
              </Text>
              <Group>
                <Text fw={600}>Birthday: </Text>
                <FhirValue
                  type="date"
                  value={patient.birthDate}
                  options={{ dateStyle: "full" }}
                />
              </Group>
              <Group>
                <Text fw={600}>Address: </Text>
                <FhirValue type="Address" value={patient.address} />
              </Group>
              <Group>
                <Text fw={600}>Contact: </Text>
                <FhirValue type="ContactPoint" value={patient.telecom} />
              </Group>
            </Stack>
          )}
        </FhirQueryLoader>
      </Paper>
      {/* <PatientReportsTable patientID={patientQuery.id} /> */}
    </Paper>
  );
}
