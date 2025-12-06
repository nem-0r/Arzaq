"""Add restaurant_profile table

Revision ID: 001
Revises:
Create Date: 2025-12-06 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create restaurant_profiles table
    op.create_table(
        'restaurant_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('address', sa.String(length=500), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('logo', sa.String(length=500), nullable=True),
        sa.Column('cover_image', sa.String(length=500), nullable=True),
        sa.Column('rating', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('status', sa.Enum('PENDING', 'APPROVED', 'REJECTED', name='restaurantstatus'), nullable=False, server_default='PENDING'),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('approved_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id')
    )

    # Create indexes
    op.create_index('ix_restaurant_profiles_id', 'restaurant_profiles', ['id'])
    op.create_index('ix_restaurant_profiles_user_id', 'restaurant_profiles', ['user_id'])

    # Add restaurant_profile_id column to foods table
    op.add_column('foods', sa.Column('restaurant_profile_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_foods_restaurant_profile', 'foods', 'restaurant_profiles', ['restaurant_profile_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    # Remove foreign key and column from foods table
    op.drop_constraint('fk_foods_restaurant_profile', 'foods', type_='foreignkey')
    op.drop_column('foods', 'restaurant_profile_id')

    # Drop indexes
    op.drop_index('ix_restaurant_profiles_user_id', table_name='restaurant_profiles')
    op.drop_index('ix_restaurant_profiles_id', table_name='restaurant_profiles')

    # Drop restaurant_profiles table
    op.drop_table('restaurant_profiles')

    # Drop enum type
    op.execute('DROP TYPE restaurantstatus')
