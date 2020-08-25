// The function will return block inline styles using block level meta-data
export default function blockStyleFn(block: Object): string {
  const blockAlignment = block.getData() && block.getData().get('text-align');
  const type = block.getType();
  if (blockAlignment) {
    return `rdw-${blockAlignment}-aligned-block`;
  }
  if (type === 'atomic') {
    return 'rdw-atomic';
  }
  return '';
}
