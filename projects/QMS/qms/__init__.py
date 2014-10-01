import json
from .Query import Query
from .DBManager import DBManager

try:
    f = open(str(__path__[0])+'\..\qms.json', 'r')
except:
    print("Missing 'qms.json'")
    raise

parsed = json.loads(f.read())
for name in parsed:
    DBManager.set(name, parsed[name]['handler'], parsed[name]['parameters'])