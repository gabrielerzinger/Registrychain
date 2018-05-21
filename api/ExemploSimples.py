from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair

tokens = {}
tokens['app_id'] = '21065222'
tokens['app_key'] = 'ca2ff5389e56fed22d1c5bd79ec0ab40'
bdb = BigchainDB('https://test.bigchaindb.com', headers=tokens)


alice = generate_keypair()
print(alice)

tx = bdb.transactions.prepare(
	operation='CREATE',
	signers=alice.public_key,
	asset={'data':{'message': 'testeum'}})

signed_tx = bdb.transactions.fulfill(tx, private_keys=alice.private_key)

bdb.transactions.send(signed_tx)

print(bdb.assets.get(search='testeum'))
