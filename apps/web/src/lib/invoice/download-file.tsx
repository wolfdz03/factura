interface DownloadFileProps {
  url: string;
  fileName: string;
}

export const downloadFile = ({ url, fileName }: DownloadFileProps) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  document.body.removeChild(link);
};
