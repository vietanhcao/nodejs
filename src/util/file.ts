import fs from 'fs';

export const deleteFile = (filePath) => {
  console.log("TCL: deleteFile -> filePath", filePath)
	
	fs.unlink(filePath, (err) => {
		if (err) {
			throw err;
		}
	});
};
