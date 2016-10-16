# XML to json converter ...
#can be modified to change the format 
# by Hash 113
f=open("quotes.xml","r")
e=open("Data.txt","w")
i=0
for line in f:
	if len(line)>13:
		line=line.lstrip()
		line=line.rstrip()
		s=len(line)
		if line[0:8]=="<author>":
			home=line.index('>')
			end=line.index('/')
			author=line[home+1:end-1]
		elif line[0:7]=="<quote>":
			home=line.index('>')
			end=line.index('/')
			quote=line[home+1:end-1]
			final="lines["+str(i)+"]={ quote:" +'"'+ quote +'"'+",author:"+'"'+author+'"' +"};"+"\n"
			e.write(final)
			i=i+1
f.close()
e.close()