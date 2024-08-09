package service

import (
		"context"
		"fmt"
		"log"
		"os"

		"github.com/Quartinal/CommanderScreenshotAPI/common/helpers"
		"github.com/chromedp/cdproto/network"
		"github.com/chromedp/chromedp"
)

func ScreenshotWebsite(url string) (string, error) {
	url = helpers.ValidateUrl(url)

	ctx, cancel := chromedp.NewContext(
		context.Background(),
	)
	defer cancel()

	var buf []byte

	hash := helpers.GenerateRandomHash()
	fileName := fmt.Sprintf("%s.png", hash)

	if err := chromedp.Run(ctx, fullScreenshot(url, 100, &buf)); err != nil {
		return "", err
	}

	if err := os.WriteFile(fmt.Sprintf("/tmp/%s", fileName), buf, 0o644); err != nil {
		return "", err
	}

	log.SetPrefix("[INFO] ")
	log.Printf("wrote %s", fileName)
	return fileName, nil
}

func fullScreenshot(urlstr string, quality int, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(urlstr),
		network.SetBlockedURLS([]string{
			"*doubleclick.net*",
			"*google.com*",
			"*googlesyndication.com*",
		}),
		chromedp.FullScreenshot(res, quality),
	}
}