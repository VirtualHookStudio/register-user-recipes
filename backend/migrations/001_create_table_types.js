/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('types', table => {
        table.increments('id').primary()
        table.string('name').notNullable().unique()
        table.timestamp('created_at').notNullable()
        table.timestamp('deleted_at')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('types')
};
