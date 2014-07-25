from qms.DBManager import DBManager


class Query:
    EQUAL = " = "
    
    NOT_EQUAL = " != "
    
    LIKE = " LIKE "
    
    UPPER = " > "
    
    UPPER_EQUAL = " >= "
    
    LOWER = " < "
    
    LOWER_EQUAL = " <= "
    
    IS = " IS "
    
    IS_NOT = " IS NOT "
    
    JOIN = " JOIN "
    
    JOIN_NATURAL = " NATURAL JOIN "
    
    JOIN_INNER = " INNER JOIN "
    
    JOIN_OUTER_FULL = " FULL OUTER JOIN "
    
    JOIN_OUTER_LEFT = " LEFT OUTER JOIN "
    
    JOIN_OUTER_RIGHT = " RIGHT OUTER JOIN "
    
    IN = " IN "
    
    MATCH = " MATCH "

    @staticmethod
    def execute(pQuery, pHandler):
        return DBManager.get(pHandler).getResult(pQuery)

    @staticmethod
    def select(pFields, pTable):
        return QuerySelect(pFields, pTable)

    @staticmethod
    def condition():
        return QueryCondition()
    


class QueryCondition():
    _and = []
    _or = []
    _havingAnd = []
    _havingOr = []
    _order = ''
    _limit = ''
    _group = ''
    
    def andCondition(self, pCondition):
        print(" AND : "+pCondition.get())
        return self
    
    def orCondition(self, pCondition):
        print(" OR : "+pCondition.get())
        return self

    def andWhere(self, pField, pOperator, pValue, pEscape = True):
        if pEscape:
            #@todo
            pass
        self._and.append(pField+pOperator+pValue)
        return self
    
    def orWhere(self, pField, pOperator, pValue, pEscape = True):
        if pEscape:
            #@todo
            pass
        self._or.append(pField+pOperator+pValue)
        return self
    
    def order(self, pField, pType='ASC'):
        if self._order == '':
            self._order = ' ORDER BY '+pField+' '+pType
        else:
            self._order += ', '+pField+' '+pType
        return self
    
    def limit(self, pFirst, pNumber):
        self._limit = ' LIMIT '+str(pFirst)+','+str(pNumber)
        return self
    
    def groupBy(self, pField):
        self._group = ' GROUP BY '+pField
        return self
    
    def get(self):
        return self.getWhere()+self._group+self._order+self._limit
    
    def getWhere(self):
        where = ""
        _and = " AND ".join(self._and)
        _or = " OR ".join(self._or)
        if _and != "":
            where = " WHERE "+_and
        if _or != "":
            if _and != "":
                where += " OR "+_or
            else:
                where += " WHERE "+_or
        return where
    

class BaseQuery:
    def __init__(self, pTable):
        self.table = pTable

    def execute(self, pHandler = 'default'):
        return Query.execute(self.get(), pHandler)

    def get(self):
        raise "La méthode 'get' doit être surchargée."


class QueryWithCondition(BaseQuery):
    _condition = None
    def andWhere(self, pField, pOperator, pValue, pEscape = True):
        self._getCondition().andWhere(pField, pOperator, pValue, pEscape)
        return self
    
    def orWhere(self, pField, pOperator, pValue, pEscape = True):
        self._getCondition().orWhere(pField, pOperator, pValue, pEscape)
        return self
    
    def limit(self, pFirst, pNumber):
        self._getCondition().limit(pFirst, pNumber)
        return self
    
    
    def _getCondition(self):
        if self._condition == None:
            self._condition = Query.condition()
        return self._condition
    
    

class QuerySelect(QueryWithCondition):
    def __init__(self, pFields, pTable):
        BaseQuery.__init__(self, pTable)
        self.fields = pFields
    
    def get(self):
        return 'SELECT '+self.fields+' FROM '+self.table+self._getCondition().get()+';'
