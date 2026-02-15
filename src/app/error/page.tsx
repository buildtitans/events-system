import ServerErrorFallback from "@/src/components/ui/fallbacks/serverError";
import Container from "@mui/material/Container";


export default function ErrorPage() {


    return (
        <Container>
            <ServerErrorFallback />
        </Container>
    )
}