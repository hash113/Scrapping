currentDir="/Users/harshbhatia/Downloads/Usenthrow/IconHoverEffects.zip"
c="/Users/harshbhatia/Downloads/Usenthrow"
d="/Volumes/Study Material/Computer Science & IT/EVEN SEM 2013/B.Tech/4th year"
import os.path, time
def printvalue(Dix):
	#print "last modified: %s" % time.ctime(os.path.getmtime(Dix))
	#print "created: %s" % time.ctime(os.path.getctime(Dix))
	modifiednew= time.ctime(os.path.getmtime(Dix))
	#print modifiednew
	return modifiednew
s=printvalue(d)

f=open("data.txt","r")
lastdate=f.readline()
f.close()
#print len(s)
#print len(lastdate)
#w="Tue Jul 16 09:41:13 2013"
#l="Tue Jul 17 09:41:13 2013"

#l=lastdate
if s == lastdate:
	print "nothing is changed"
else:
	q=open("data.txt","w")
	q.write(s)
	print "some files are changed"
	q.close()
#s="str"
#lastdate="str
#print getInfos(currentDir)

#print os.stat("/Users/harshbhatia/Downloads/Usenthrow")
