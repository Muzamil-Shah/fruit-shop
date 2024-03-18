import { FileBrowsers } from "../_component/file-browser";

export default function FilesPage() {
  return (
    <>
      <FileBrowsers title="Your Files" favorites={false} />
    </>
  );
}
