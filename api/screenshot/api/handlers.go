package api

import (
		"fmt"
		"net/http"

		"github.com/Quartinal/CommanderScreenshotAPI/common/helpers"
		"github.com/Quartinal/CommanderScreenshotAPI/common/types"
		"github.com/Quartinal/CommanderScreenshotAPI/service"
)

func StorageHandler() http.Handler {
	return http.StripPrefix("/storage/", http.FileServer(
		helpers.NoListFileSystem{Fsys: http.Dir("/tmp")},
	))
}

func ScreenshotWebsiteHandler(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Query().Get("url")
	
	filename, err := service.ScreenshotWebsite(url)
	if err != nil {
		errResp := types.ErrorResponse{
			Error: err.Error(),
		}
		helpers.WriteJSON(w, http.StatusUnprocessableEntity, &errResp)
		return
	}

	screenshotResp := types.ScreenshotResponse{
		ScreenshotURL: fmt.Sprint(r.Host + "/storage/" + filename),
	}

	helpers.WriteJSON(w, http.StatusOK, &screenshotResp)
}