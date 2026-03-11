"use client";
import AccountDetails from "../../sections/user/accountDetails";
import type { UserEmailType } from "@/src/lib/store/slices/user/types";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";


export default function RenderUserAccount({ email }: { email: UserEmailType}) {


    switch(email.status) {

        case "pending": {
            return (
                <SimpleBackdrop />
            )
        }
        case "ready": {
           return (<AccountDetails email={email.data} />)
        }

        default: {
            return (
                <SimpleBackdrop />
            )
        }
    }
}