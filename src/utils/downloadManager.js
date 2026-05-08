import { downloadAPI } from '../services/api';

/**
 * Polls the download status endpoint until the download is ready
 * @param {string} downloadId - The download ID returned from startDownload
 * @param {function} onProgress - Callback with status updates
 * @param {function} onComplete - Callback when download_link is available
 * @param {function} onError - Callback on error
 * @returns {function} - Function to stop polling
 */
export const pollDownloadStatus = (downloadId, onProgress, onComplete, onError) => {
  let isPolling = true;
  let pollCount = 0;
  const maxPolls = 240; // 4 minutes with 1-second intervals

  const poll = async () => {
    if (!isPolling || pollCount >= maxPolls) {
      if (pollCount >= maxPolls) {
        onError('Download processing timeout. Please check status later.');
      }
      return;
    }

    try {
      const response = await downloadAPI.getDownloadStatus(downloadId);
      const data = response.data.data || response.data;

      // Update progress
      onProgress({
        status: data.status,
        progress: data.progress || (data.status === 'success' ? 100 : 50),
        downloadLink: data.download_link,
        errorMsg: data.error_msg,
      });

      // Check if download is ready
      if (data.status === 'success' && data.download_link) {
        isPolling = false;
        onComplete(data.download_link);
        return;
      }

      // Check if there was an error
      if (data.status === 'failed') {
        isPolling = false;
        onError(data.error_msg || 'Download failed');
        return;
      }

      // Continue polling
      pollCount++;
      setTimeout(poll, 1000); // Poll every 1 second
    } catch (error) {
      isPolling = false;
      onError(error.message || 'Failed to check download status');
    }
  };

  // Start polling
  poll();

  // Return function to stop polling
  return () => {
    isPolling = false;
  };
};

/**
 * Triggers actual download of a file from a URL
 * @param {string} url - The URL to download from
 * @param {string} filename - Optional filename for the download
 */
export const triggerDownload = (url, filename) => {
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    if (filename) {
      link.download = filename;
    }
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download trigger failed:', error);
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
};
