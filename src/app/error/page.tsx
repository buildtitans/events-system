import ServerErrorFallback from "@/src/components/ui/fallbacks/serverError";
import Container from "@mui/material/Container";


//TODO: finish <ServerErrorFallback /> styling

export default function ErrorPage() {


    return (
        <Container>
            <ServerErrorFallback />
        </Container>
    )
}