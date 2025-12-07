"""Initial schema

Revision ID: 001
Revises:
Create Date: 2024-12-07 12:00:00.000000

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
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=True),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('google_id', sa.String(length=255), nullable=True),
        sa.Column('supabase_id', sa.String(length=255), nullable=True),
        sa.Column('role', sa.Enum('client', 'restaurant', 'admin', name='userrole'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_approved', sa.Boolean(), nullable=True, default=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('address', sa.String(length=500), nullable=True),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('rating', sa.Float(), nullable=True, default=0.0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_google_id'), 'users', ['google_id'], unique=True)
    op.create_index(op.f('ix_users_supabase_id'), 'users', ['supabase_id'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Create foods table
    op.create_table('foods',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image', sa.String(length=500), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('old_price', sa.Float(), nullable=True),
        sa.Column('discount', sa.Integer(), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=False, default=0),
        sa.Column('is_available', sa.Boolean(), nullable=True, default=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('restaurant_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['restaurant_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_foods_id'), 'foods', ['id'], unique=False)

    # Create orders table
    op.create_table('orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'paid', 'confirmed', 'ready', 'completed', 'cancelled', name='orderstatus'), nullable=False),
        sa.Column('subtotal', sa.Float(), nullable=False),
        sa.Column('platform_fee', sa.Float(), nullable=False),
        sa.Column('total', sa.Float(), nullable=False),
        sa.Column('pickup_code', sa.String(length=50), nullable=True),
        sa.Column('qr_code_path', sa.String(length=500), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_orders_id'), 'orders', ['id'], unique=False)
    op.create_index(op.f('ix_orders_pickup_code'), 'orders', ['pickup_code'], unique=True)

    # Create order_items table
    op.create_table('order_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('food_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('subtotal', sa.Float(), nullable=False),
        sa.Column('restaurant_amount', sa.Float(), nullable=False),
        sa.Column('platform_amount', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['food_id'], ['foods.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_items_id'), 'order_items', ['id'], unique=False)

    # Create reservations table
    op.create_table('reservations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('food_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('active', 'confirmed', 'expired', 'cancelled', name='reservationstatus'), nullable=False),
        sa.Column('session_id', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['food_id'], ['foods.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reservations_id'), 'reservations', ['id'], unique=False)
    op.create_index(op.f('ix_reservations_session_id'), 'reservations', ['session_id'], unique=False)

    # Create payments table
    op.create_table('payments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('payment_method', sa.Enum('paybox', 'cash', name='paymentmethod'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'success', 'failed', 'refunded', name='paymentstatus'), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('paybox_payment_id', sa.String(length=255), nullable=True),
        sa.Column('paybox_transaction_id', sa.String(length=255), nullable=True),
        sa.Column('paybox_signature', sa.String(length=500), nullable=True),
        sa.Column('paybox_response', sa.Text(), nullable=True),
        sa.Column('failure_reason', sa.String(length=500), nullable=True),
        sa.Column('refund_reason', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('refunded_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payments_id'), 'payments', ['id'], unique=False)
    op.create_index(op.f('ix_payments_order_id'), 'payments', ['order_id'], unique=True)
    op.create_index(op.f('ix_payments_paybox_payment_id'), 'payments', ['paybox_payment_id'], unique=True)


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index(op.f('ix_payments_paybox_payment_id'), table_name='payments')
    op.drop_index(op.f('ix_payments_order_id'), table_name='payments')
    op.drop_index(op.f('ix_payments_id'), table_name='payments')
    op.drop_table('payments')

    op.drop_index(op.f('ix_reservations_session_id'), table_name='reservations')
    op.drop_index(op.f('ix_reservations_id'), table_name='reservations')
    op.drop_table('reservations')

    op.drop_index(op.f('ix_order_items_id'), table_name='order_items')
    op.drop_table('order_items')

    op.drop_index(op.f('ix_orders_pickup_code'), table_name='orders')
    op.drop_index(op.f('ix_orders_id'), table_name='orders')
    op.drop_table('orders')

    op.drop_index(op.f('ix_foods_id'), table_name='foods')
    op.drop_table('foods')

    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_supabase_id'), table_name='users')
    op.drop_index(op.f('ix_users_google_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')

    # Drop enums
    sa.Enum(name='paymentstatus').drop(op.get_bind())
    sa.Enum(name='paymentmethod').drop(op.get_bind())
    sa.Enum(name='reservationstatus').drop(op.get_bind())
    sa.Enum(name='orderstatus').drop(op.get_bind())
    sa.Enum(name='userrole').drop(op.get_bind())
