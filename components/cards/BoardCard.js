import { Card, CardTitle } from './Card';

export function BoardCard({ title, boardColor = '#000000' }) {
  boardColor = boardColor ?? '#000000'; // if null in the db, set to black

  return (
    <Card boardColor={boardColor}>
      <CardTitle>{title}</CardTitle>
    </Card>
  );
}
