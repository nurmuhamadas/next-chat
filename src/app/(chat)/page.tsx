import Image from "next/image"

export default function Home() {
  return (
    <div className="hidden h-screen flex-1 md:flex-center">
      <div className="gap-y-6 flex-col-center">
        <Image
          src="/images/no-message.svg"
          alt="no conversation"
          width={200}
          height={169}
          className="h-auto w-28 lg:w-32"
        />
        <div className="gap-y-2 flex-col-center">
          <h4 className="h4">No conversation selected</h4>
          <p className="body-2">Selected conversation will be displayed here</p>
        </div>
      </div>
    </div>
  )
}
