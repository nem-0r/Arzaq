"""Add posts table and PayBox fields to users

Revision ID: 002
Revises: 001
Create Date: 2024-12-08 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add PayBox fields to users table
    op.add_column('users', sa.Column('paybox_merchant_id', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('paybox_secret_key', sa.String(length=255), nullable=True))

    # Create posts table
    op.create_table('posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('location', sa.String(length=255), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('restaurant_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['restaurant_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_posts_id'), 'posts', ['id'], unique=False)
    op.create_index(op.f('ix_posts_user_id'), 'posts', ['user_id'], unique=False)
    op.create_index(op.f('ix_posts_restaurant_id'), 'posts', ['restaurant_id'], unique=False)


def downgrade() -> None:
    # Drop posts table
    op.drop_index(op.f('ix_posts_restaurant_id'), table_name='posts')
    op.drop_index(op.f('ix_posts_user_id'), table_name='posts')
    op.drop_index(op.f('ix_posts_id'), table_name='posts')
    op.drop_table('posts')

    # Remove PayBox fields from users table
    op.drop_column('users', 'paybox_secret_key')
    op.drop_column('users', 'paybox_merchant_id')
