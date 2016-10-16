
# # Rename mp3 files to naming convention of no number and no special character and hence making your music library cool again to read
# # run this file in using terminal in music directory by command ./Mp3FileNameBeautify.sh
# # and you are welcome to contribute, customize or whatever.
# # suggestions are welcomed
# # by - HARSH BHATIA
# for i in *.mp3;
#     do
#         src=$i
#         # remove mp3 from name
#         tgt=$(echo $i | sed -E 's/(.mp3)//g')
#         # remove names of websites 
#         tgt=$(echo $tgt | sed -E 's/www.Songs.PK//g')
#         tgt=$(echo $tgt | sed -E 's/wwwSongspk//g')
#         tgt=$(echo $tgt | sed -E 's/www.TumTube.com//g')
#         tgt=$(echo $tgt | sed -E 's/MusikMaza.Com//g')
#         tgt=$(echo $tgt | sed -E 's/www.SpreadMp3.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.Songs.PK.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.Songs.cc//g')
#         tgt=$(echo $tgt | sed -E 's/www.Songs.CC//g')
#         tgt=$(echo $tgt | sed -E 's/www.Songspk.name//g')
#         tgt=$(echo $tgt | sed -E 's/OFFICIAL VIDEO//g')
#         tgt=$(echo $tgt | sed -E 's/VIDEO//g')
#         tgt=$(echo $tgt | sed -E 's/video//g')
#         tgt=$(echo $tgt | sed -E 's/Video//g')
#         tgt=$(echo $tgt | sed -E 's/Official//g')
#         tgt=$(echo $tgt | sed -E 's/Music//g')
#         tgt=$(echo $tgt | sed -E 's/music//g')
#         tgt=$(echo $tgt | sed -E 's/www.keepvid.com//g')
#         tgt=$(echo $tgt | sed -E 's/lyrics//g')
#         tgt=$(echo $tgt | sed -E 's/Lyrics//g')
#         tgt=$(echo $tgt | sed -E 's/www.Youtube.com//g')
#         tgt=$(echo $tgt | sed -E 's/Youtube//g')
#         tgt=$(echo $tgt | sed -E 's/www.DJMaza.info//g')
#         tgt=$(echo $tgt | sed -E 's/www.DJMaza.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.MusikMaza.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.Tube2u.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.123musiq.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.Fmw11.com//g')
#         tgt=$(echo $tgt | sed -E 's/DownloadMing.SE//g')
#         tgt=$(echo $tgt | sed -E 's/www.TumTube.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.MusikMaza.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.SpreadMp3.com//g')
#         tgt=$(echo $tgt | sed -E 's/www.Songspk.CC//g')
#         tgt=$(echo $tgt | sed -E 's/www.Songspk.name//g')
#         tgt=$(echo $tgt | sed -E 's/www.FunMaza.com//g')
#         # convert to lowercase
#         tgt=$(echo $tgt | tr 'A-Z' 'a-z')
#         # replace all numbers
#         tgt=$(echo $tgt | sed -E 's/[0-9]*//g')
#         # remove special character
#         tgt=$(echo $tgt | sed -E 's/[][\\^()*!@+.$-]//g')
#         # trim all whitespaces
#         tgt=$(echo $tgt | sed -E 's/^[ \t]*//;s/[ \t]*$//g')
#         # append mp3 later
#         tgt=$(echo $tgt | sed "s/$/.mp3/")
#         mv "$src" "$tgt"
#     done

