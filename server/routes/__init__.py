from .login import router as login_router
from .register import router as register_router
from .dashboard import router as dashboard_router
from .games import router as games_router
from .coins import router as coins_router
from .portfolio import router as portfolio_router
from .leaderboard import router as leaderboard_router
from .account import router as account_router
from .coinflip import router as coinflip_router
from .blackjack import router as blackjack_router
from .auth import router as auth_router

from .admin.login import router as admin_login_router
from .admin.dashboard import router as admin_dashboard_router