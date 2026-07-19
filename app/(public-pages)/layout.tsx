import WhatsAppButton from "@/components/landing/WhatsAppButton"

export default function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WhatsAppButton />
    </>
  )
}
