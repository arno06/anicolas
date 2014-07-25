import pymysql


class MysqlHandler:
    def __init__(self, pHost, pUser, pPass, pDb):
        self.connexion = pymysql.connect(host=pHost, user=pUser, passwd=pPass, db=pDb)
    
    def execute(self, pQuery):
        #@todo
        pass
    
    def getResult(self, pQuery):
        result = []
        cur = self.connexion.cursor()
        cur.execute(pQuery)
        cols = []
        for col in cur.description:
            cols.append(col[0])
        for row in cur:
            line = {}
            for k, v in zip(cols, row):
                line[k] = v
            result.append(line)
        cur.close()
        return result
    
    def close(self):
        self.connexion.close()
