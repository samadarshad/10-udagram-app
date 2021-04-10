import getGroups from '@functions/http/getGroups';
import createGroup from '@functions/http/createGroup';
import getImages from '@functions/http/getImages';
import getImage from '@functions/http/getImage';
import createImage from '@functions/http/createImage';
import sendNotifications from '@functions/s3/sendNotifications';
import connect from '@functions/websocket/connect';
import disconnect from '@functions/websocket/disconnect'; 
import syncWithElasticSearch from '@functions/dynamoDb/elasticSearchSync';
import resizeImage from '@functions/s3/resizeImage';

export default { 
    getGroups,
    createGroup,
    getImages,
    getImage,
    createImage,
    sendNotifications,
    connect,
    disconnect,
    syncWithElasticSearch,
    resizeImage
  }