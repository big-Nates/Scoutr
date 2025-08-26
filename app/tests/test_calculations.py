from app.calculations import add, BankAccount, InsufficientFunds
import pytest
@pytest.fixture
def zero_bank_account():
    return BankAccount()

@pytest.fixture
def bank_account():
    return BankAccount(100)

@pytest.mark.parametrize("x, y, expected",[
    (1, 4, 5),
    (10, -5, 5),
    (2, 5, 7)
])
def test_add(x, y, expected):
    assert add(x,y) == expected



def test_bank_set_init_amount(bank_account):
    assert bank_account.balance == 100

def test_bank_default_amount(zero_bank_account):
    assert zero_bank_account.balance == 0

def test_bank_withdraw(bank_account):
    bank_account.withdraw(50)
    assert bank_account.balance == 50

def test_bank_deposit(bank_account):
    bank_account.deposit(50)
    assert bank_account.balance == 150

def test_bank_collect_interest(bank_account):
    bank_account.collect_interest()
    assert round(bank_account.balance, 0) == 101

@pytest.mark.parametrize("deposited, withdrew, expected",[
    (200, 100, 100),
    (100, 100, 0)
])
def test_bank_transaction(zero_bank_account, deposited, withdrew, expected):
    zero_bank_account.deposit(deposited)
    zero_bank_account.withdraw(withdrew)
    assert zero_bank_account.balance == expected

def test_insufficient_funds(zero_bank_account):
    with pytest.raises(InsufficientFunds):
        zero_bank_account.withdraw(100)
