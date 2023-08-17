/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.boolean('permission').notNullable().defaultTo(false)
        table.string('password').notNullable()
        table.string('user_icon').notNullable()
        table.string('name').notNullable().unique()
        table.string('email').notNullable().unique()
        table.string('phone').notNullable().unique()
        table.string('cpf').notNullable().unique()
        table.timestamp('created_at').notNullable()
        table.timestamp('deleted_at')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};
