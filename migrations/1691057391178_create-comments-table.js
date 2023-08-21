exports.up = (pgm) =>
  pgm.createTable('comments', {
    id: {
      type: 'varchar(50)',
      primaryKey: true
    },
    content: {
      type: 'text',
      notNull: true
    },
    owner: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade'
    },
    thread_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"threads"',
      onDelete: 'cascade'
    },
    is_deleted: {
      type: 'boolean',
      default: false
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })

exports.down = (pgm) => pgm.dropTable('comments')
