'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Filter,
  ChevronDown,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

interface Job {
  id: string;
  source: string;
  externalId: string;
  externalUrl: string | null;
  title: string;
  description: string | null;
  company: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  contractValue: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryType: string | null;
  category: string | null;
  jobType: string | null;
  isRemote: boolean;
  postedAt: string | null;
  deadline: string | null;
  isSaved: boolean;
  saveStatus: string | null;
  saveNotes: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SyncStatus {
  sources: { name: string; configured: boolean; jobCount: number }[];
  totalJobs: number;
  lastSyncAt: string | null;
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

const CATEGORIES = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'painting', label: 'Painting' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general', label: 'General Contracting' },
];

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'bid', label: 'Bid Opportunity' },
  { value: 'part-time', label: 'Part-time' },
];

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  sam_gov: { label: 'SAM.gov', color: 'bg-blue-100 text-blue-800' },
  jooble: { label: 'Jooble', color: 'bg-green-100 text-green-800' },
  adzuna: { label: 'Adzuna', color: 'bg-purple-100 text-purple-800' },
};

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterJobType, setFilterJobType] = useState('');

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filterState) params.append('state', filterState);
      if (filterCategory) params.append('category', filterCategory);
      if (filterSource) params.append('source', filterSource);
      if (filterJobType) params.append('jobType', filterJobType);
      if (activeTab === 'saved') params.append('savedOnly', 'true');
      params.append('page', pagination.page.toString());
      params.append('limit', '20');

      const res = await fetch(`/api/job-board?${params}`);
      const data = await res.json();

      if (data.jobs) {
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterState, filterCategory, filterSource, filterJobType, activeTab, pagination.page]);

  // Fetch sync status
  const fetchSyncStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/job-board/sync');
      const data = await res.json();
      setSyncStatus(data);
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  }, []);

  // Sync jobs from external sources
  const syncJobs = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/job-board/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`Synced ${data.imported} new jobs, updated ${data.updated} existing jobs`);
        fetchJobs();
        fetchSyncStatus();
      }
    } catch (error) {
      console.error('Error syncing jobs:', error);
      alert('Failed to sync jobs');
    } finally {
      setSyncing(false);
    }
  };

  // Toggle save job
  const toggleSaveJob = async (job: Job) => {
    try {
      if (job.isSaved) {
        // Need to find the save ID - for now just refetch
        // In production, we'd track the save ID
        await fetch(`/api/job-board/saved`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job.id, status: 'unsaved' }),
        });
      } else {
        await fetch('/api/job-board/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job.id }),
        });
      }
      fetchJobs();
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSyncStatus();
  }, [fetchJobs, fetchSyncStatus]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get salary display
  const getSalaryDisplay = (job: Job) => {
    if (job.contractValue) {
      return formatCurrency(job.contractValue);
    }
    if (job.salaryMin && job.salaryMax) {
      return `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`;
    }
    if (job.salaryMin) {
      return `From ${formatCurrency(job.salaryMin)}`;
    }
    if (job.salaryMax) {
      return `Up to ${formatCurrency(job.salaryMax)}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-orange-600" />
            Job Board
          </h1>
          <p className="text-gray-500 mt-1">
            Browse contractor jobs from multiple sources
          </p>
        </div>
        <button
          onClick={syncJobs}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Jobs'}
        </button>
      </div>

      {/* Sync Status */}
      {syncStatus && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">{syncStatus.totalJobs}</span>
                <span className="text-gray-500 ml-2">Total Jobs</span>
              </div>
              <div className="flex items-center gap-4">
                {syncStatus.sources.map(source => (
                  <div key={source.name} className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      SOURCE_LABELS[source.name]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {SOURCE_LABELS[source.name]?.label || source.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {source.configured ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {source.jobCount}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <XCircle className="h-4 w-4" />
                          Not configured
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {syncStatus.lastSyncAt && (
              <span className="text-sm text-gray-500">
                Last synced: {formatDate(syncStatus.lastSyncAt)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tabs and Search */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'all'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  activeTab === 'saved'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className="h-4 w-4" />
                Saved Jobs
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-4 pb-4 grid grid-cols-4 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All States</option>
                  {US_STATES.map(state => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Sources</option>
                  {Object.entries(SOURCE_LABELS).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={filterJobType}
                  onChange={(e) => setFilterJobType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Job List */}
        <div className="divide-y">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="text-gray-500 mt-1">
                {activeTab === 'saved'
                  ? 'You haven\'t saved any jobs yet'
                  : 'Try adjusting your filters or sync new jobs'}
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={syncJobs}
                  className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Sync Jobs Now
                </button>
              )}
            </div>
          ) : (
            jobs.map(job => (
              <div
                key={job.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        SOURCE_LABELS[job.source]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {SOURCE_LABELS[job.source]?.label || job.source}
                      </span>
                      {job.jobType && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                          {job.jobType}
                        </span>
                      )}
                      {job.deadline && new Date(job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Deadline soon
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      {job.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </span>
                      )}
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      )}
                      {getSalaryDisplay(job) && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign className="h-4 w-4" />
                          {getSalaryDisplay(job)}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {job.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                      {job.postedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Posted {formatDate(job.postedAt)}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Deadline {formatDate(job.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job);
                      }}
                      className={`p-2 rounded-lg ${
                        job.isSaved
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-400 hover:text-orange-600'
                      }`}
                    >
                      {job.isSaved ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                    {job.externalUrl && (
                      <a
                        href={job.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-blue-600"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} jobs
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      SOURCE_LABELS[selectedJob.source]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {SOURCE_LABELS[selectedJob.source]?.label || selectedJob.source}
                    </span>
                    {selectedJob.category && (
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                        {selectedJob.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  {selectedJob.company && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Building2 className="h-4 w-4" />
                      {selectedJob.company}
                    </span>
                  )}
                  {selectedJob.location && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </span>
                  )}
                </div>

                {getSalaryDisplay(selectedJob) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <span className="flex items-center gap-2 text-green-700 font-semibold">
                      <DollarSign className="h-5 w-5" />
                      {getSalaryDisplay(selectedJob)}
                      {selectedJob.salaryType && ` (${selectedJob.salaryType})`}
                    </span>
                  </div>
                )}

                <div className="flex gap-4 text-sm text-gray-500">
                  {selectedJob.postedAt && (
                    <span>Posted: {formatDate(selectedJob.postedAt)}</span>
                  )}
                  {selectedJob.deadline && (
                    <span className="text-red-600">Deadline: {formatDate(selectedJob.deadline)}</span>
                  )}
                </div>

                {selectedJob.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => toggleSaveJob(selectedJob)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium ${
                      selectedJob.isSaved
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {selectedJob.isSaved ? (
                      <>
                        <BookmarkCheck className="h-5 w-5" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-5 w-5" />
                        Save Job
                      </>
                    )}
                  </button>
                  {selectedJob.externalUrl && (
                    <a
                      href={selectedJob.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
                    >
                      <ExternalLink className="h-5 w-5" />
                      View Original
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
