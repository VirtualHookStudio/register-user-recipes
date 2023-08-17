/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('recipes', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('description', 2500).notNullable()
        table.string('img_location').notNullable()
        table.integer('user_id').references('id').inTable('users').notNullable().onDelete('cascade')
        table.integer('type_id').references('id').inTable('types').notNullable()
        table.timestamp('created_at').notNullable()
        table.timestamp('deleted_at')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('recipes')
};
