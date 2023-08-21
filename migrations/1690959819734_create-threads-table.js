exports.up = (pgm) =>
  pgm.createTable('threads', {
    id: {
      type: 'varchar(50)',
      primaryKey: true
    },
    title: {
      type: 'text',
      notNull: true
    },
    body: {
      type: 'text',
      notNull: true
    },
    owner: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade'
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })

exports.down = (pgm) => pgm.dropTable('threads')
