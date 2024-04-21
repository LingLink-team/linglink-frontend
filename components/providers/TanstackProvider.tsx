"use client"

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
    // const [queryClient] = useState(() => new QueryClient())
    const [client] = React.useState(new QueryClient());
    return (
        <QueryClientProvider client={client}>
            <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
        </QueryClientProvider>
    )
    // < QueryClientProvider client = { queryClient } >
    //     { children }
    // </QueryClientProvider >
}

export default TanstackProvider