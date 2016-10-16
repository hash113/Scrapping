
#"Convert text file into xml"
#by Hash113
k=[]
q=open("quote.txt")
d=open("final.txt",'w')
i=0
w=q.readlines()
for i in range(0,len(w)-1):
    f=w[i]
    a=w[i+1]
    a=a.strip()
    f=f.strip()
    if (len(f)>14):
        quote=f
        d.write("<note>\n\t<author>"+a+"</author>\n\t<tag></tag>\n\t<quote>"+f+"</quote>\n</note>\n\n")

"""
<note>
    <author>Albert Einstein</author>
    <tag>Victory</tag>
    <quote>Failure is just a state of mind</quote>
</note>
"""