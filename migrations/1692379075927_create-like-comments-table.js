exports.up = (pgm) =>
  pgm.createTable('like_comments', {
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'cascade'
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade'
    }
  })

exports.down = (pgm) => pgm.dropTable('like_comments')
