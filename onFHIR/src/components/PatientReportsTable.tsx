import {FC, ReactElement} from "react";

type PatientReportsTableProps = {
    patientID: string;
};

const PatientReportsTable: FC<PatientReportsTableProps> = ({
    patientID,
}): ReactElement => {
    return (
        <div>
            <p>{patientID}</p>
        </div>
    );
};

export default PatientReportsTable