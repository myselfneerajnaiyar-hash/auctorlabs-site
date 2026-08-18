const PDF_PATH = "/downloads/RC_Cheatsheet_Auctor%20Labs.pdf";
const DOWNLOAD_FILENAME = "Auctor-Labs-RC-Cheat-Sheet.pdf";

export async function GET(request: Request) {
  const pdfResponse = await fetch(new URL(PDF_PATH, request.url));

  if (!pdfResponse.ok || !pdfResponse.body) {
    return new Response("RC Cheat Sheet not found", { status: 404 });
  }

  return new Response(pdfResponse.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${DOWNLOAD_FILENAME}"`,
    },
  });
}
