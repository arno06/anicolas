from qms import *

result = Query.select('*', 'main_user').execute()

print(result)

query = Query.select('*', 'jos_content').limit(0, 10)
result = query.execute()

print(str(len(result))+" results for :"+query.get())

f = open('liste.txt', 'r')
ct = 0
q2 = Query.select('*', 't_cle_activation')
ors = []
for line in f:
    q2.orWhere('activationKey', Query.LIKE, line.replace('\n', '').replace('\r', ''))

print(q2.execute('vidalid'))

