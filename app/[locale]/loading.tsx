export default function Loading() {
    return (
        <section className="h-screen flex justify-center gap-8 items-center absolute top-0 bottom-0 left-0 right-0 bg-white/30 z-50 backdrop-blur-sm">
            <div className="rounded-md h-24 w-24 border-4 border-t-4 border-blue-500 animate-spin"></div>
            <div className="text-xl font-bold">
                Đang tải ...
            </div>
        </section>
    )
}