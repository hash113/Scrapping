#!/bin/bash
#
#
# To use it as service on Ubuntu:

# sudo cp devshelf.sh /etc/init.d/devshelf

# sudo chmod a+x /etc/init.d/devshelf

# sudo update-rc.d devshelf defaults

#

# Then use commands:

# service devshelf <command (start|stop|etc)>



NAME=scaler                                                             # Unique name for the application
USER=plutoadmin                                                              # User for process running    

pidfile=/var/run/$NAME.pid
logfile=/var/log/$NAME.log
forever_log=/opt/scaler/logs_temp/forever.log
forever_error=/opt/scaler/logs_temp/forever_error.log
sbt_log=/opt/scaler/logs_temp/sbt.log

# Following are environment variables
# the forever needs to be in the path to be served correctly

forever_home=/home/plutoadmin/.nvm/versions/node/v0.12.5/bin
SOUREC_DIR=/opt/scaler/node-merchandise/           # Location of the application source
AZKABAN_HOME=/usr/lib/azkaban/azkaban-solo-2.5.0
SBT_LAUNCH=/opt/scaler/multiproject/backend/
SBT_HOME=/home/plutoadmin/installers/sbt

export PATH=$PATH:$forever_home

# Node environment settings
COMMAND="/home/plutoadmin/.nvm/versions/node/v0.12.5/bin/node --max-old-space-size=4096"                                # Command to run
SOURCE_NAME=server.js                                                   # Name os the applcation entry point script
forever=$forever_home/forever

start() {
    echo "start called $NAME"
    #chaging owner as well as group

    # TODO what to do if the logfile and pidfile are already existing it will throw and error when we try to touch
    # TODO we may simply catch that error [$?] and then proceed with chown which will work everytime
    touch $logfile
    chown $USER:$USER $logfile
    touch $pidfile
    chown $USERP:$USER $pidfile

    echo "Starting $NAME node instance  with user $USER "
    sudo -H -u $USER $forever start --pidfile $pidfile -l $forever_log -e $forever_error -a --sourceDir $SOUREC_DIR -c "/home/plutoadmin/.nvm/versions/node/v0.12.5/bin/node --max-old-space-size=4096" $SOURCE_NAME 

    echo "Starting SBT now"
    cd $SBT_LAUNCH
    #TODO set SBT_HOME
    sudo -u $USER $SBT_HOME/bin/sbt "~run 9090" >>$sbt_log 2>&1 &

    if [ $? -eq 1 ]; then
            echo "SBT start failed"  
            #TODO TRIGGER EMAIL
    else
            sleep 30
            echo "SBT startup completed"
    fi   
    cd -

    echo "Starting azkaban now"
    rm -f $AZKABAN_HOME/data/azkaban.lock.db  
    if [ $? -eq 1 ]; then
        echo "no azkaban lock to delete"
    else
        echo "deleted azkaban lock from previous run"  
        cd $AZKABAN_HOME
        #(need to start from outside the script folder)
        sudo -H -u $USER bin/azkaban-solo-start.sh >>$logfile 2>&1 &

        if [ $? -eq 1 ]; then
            echo "Azkaban start failed"  
            #TODO TRIGGER EMAIL
        else
            echo "Azkaban startup completed"
        fi   
        #must return back to the directory where the script control was
        cd -
    fi



    RETVAL=0

}


stop() {

	echo "Stoping $NAME node instance  with user $USER "
        sudo -H -u $USER $forever stopall 
	echo "Stopping azkaban"
	cd $AZKABAN_HOME
        #(need to start from outside the script folder)
        sudo -u $USER bin/azkaban-solo-shutdown.sh >>$logfile 2>&1 &

        if [ $? -eq 1 ]; then
            echo "Azkaban stop failed"  
            #TODO TRIGGER EMAIL
        else
            echo "Azkaban stop completed"
        fi
	
	pkill -kill java
}



case "$1" in
    start)

        start

        ;;

    stop)
	stop


        ;;

    status)

        echo "$1 is not implemented"

        ;;

    restart)

        echo "$1 is not implemented"

        ;;

    *)

        echo "Usage:  {start|stop|status|restart}"

        exit 1

        ;;

esac

exit $RETVAL

