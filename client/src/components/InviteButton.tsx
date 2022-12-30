export const InviteButton = () => {
  const copyLink = () => navigator.clipboard.writeText(`${window.location.href}/join`)

  return (
    <button
      onClick={copyLink}
      className="grid ml-4 px-4 py-1 bg-zinc-200 rounded-full text-xs font-semibold group"
    >
      <span className="row-start-1 col-start-1 invisible group-active:visible">Copied!</span>
      <span className="row-start-1 col-start-1 group-active:invisible">Invite people!</span>
    </button>
  )
}
