import { fetchLinkTreeItems } from "@/utils/linktree";
import { LinkTree } from "@/components/linktree/LinkTree";

export default async function LinkTreePage() {
  const items = await fetchLinkTreeItems();
  return <LinkTree items={items} title="Link Tree" subtitle="Quick access to our most important links" />;
}
