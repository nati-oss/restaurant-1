from unittest.mock import patch, MagicMock
from django.core.management import call_command
from django.test import TestCase
from django.db.utils import OperationalError


class CommandTest(TestCase):

    @patch('core.management.commands.wait_for_db.connections')
    def test_wait_for_db_ready(self, mock_connections):
        """DB is ready immediately"""

        mock_conn = MagicMock()
        mock_conn.cursor = MagicMock()

        mock_connections.__getitem__.return_value = mock_conn

        call_command('wait_for_db')

        mock_conn.cursor.assert_called_once()

    @patch('core.management.commands.wait_for_db.connections')
    def test_wait_for_db_delay(self, mock_connections):
        """DB fails several times before being ready"""

        mock_conn = MagicMock()

        mock_conn.cursor.side_effect = (
            [OperationalError] * 5 + [MagicMock()]
        )

        mock_connections.__getitem__.return_value = mock_conn

        call_command('wait_for_db')

        self.assertEqual(mock_conn.cursor.call_count, 6)